import React, { Component, PropTypes } from "react";
import { composeWithTracker } from "react-komposer";
import { ReactionProduct } from "/lib/api";
import { Tags, Media } from "/lib/collections";
import { ProductAdmin } from "../components";

class ProductAdminContainer extends Component {
  render() {
    return (
      <ProductAdmin {...this.props} />
    );
  }
}

function handleProductFieldChange(productId, fieldName, value) {
  Meteor.call("products/updateProductField", productId, fieldName, value);
}

function handleProductMetafieldChange(productId, metafield, index) {
  // const productId = ReactionProduct.selectedProductId();
  // const updateMeta = {
  //   key: $(event.currentTarget).parent().children(".metafield-key-input").val(),
  //   value: $(event.currentTarget).parent().children(".metafield-value-input").val()
  // };
  //

  // update existing metafield
  if (index >= 0) {
    Meteor.call("products/updateMetaFields", productId, metafield, index);
    // $(event.currentTarget).animate({
    //   backgroundColor: "#e2f2e2"
    // }).animate({
    //   backgroundColor: "#fff"
    // });
    // return Tracker.flush();
  }

  // if (metafield.value && !metafield.key) {
  //   $(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
  // }

  // Create new meta field
  if (metafield.key && metafield.value) {
    Meteor.call("products/updateMetaFields", productId, metafield);
    // Tracker.flush();
    // $(event.currentTarget).parent().children(".metafield-key-input").val("").focus();
    // return $(event.currentTarget).parent().children(".metafield-value-input").val("");
  }
}

function handleProductMetafieldRemove(productId, metafield) {
  Meteor.call("products/removeMetaFields", productId, metafield);
}

function composer(props, onData) {
  const product = ReactionProduct.selectedProduct();
  let tags;
  let media;

  if (product) {
    if (_.isArray(product.hashtags)) {
      tags = _.map(product.hashtags, function (id) {
        return Tags.findOne(id);
      });
    }

    let mediaArray = [];
    let selectedVariant = ReactionProduct.selectedVariant();

    if (selectedVariant) {
      mediaArray = Media.find({
        "metadata.variantId": selectedVariant._id
      }, {
        sort: {
          "metadata.priority": 1
        }
      });
    }
  }



  onData(null, {
    product: product,
    media,
    tags,
    handleProductFieldChange,
    handleProductMetafieldChange,
    handleProductMetafieldRemove
  });
}

// Decorate component and export
let decoratedComponent;
decoratedComponent = composeWithTracker(composer)(ProductAdminContainer);

export default decoratedComponent;
